import { ServerConnection } from "message-event-channel";
import { ApplicationBlockedError, ApplicationExitError } from "./errors";
import { BriefTemplate } from "./types";

export type AmplienceContentStudioOptions = {
  baseUrl?: string;
  windowTarget?: string;
  windowFeatures?: string;
};

export type GetContentOptions = Record<string, never>;

export type GetContentResult = {
  success: boolean;
  template?: BriefTemplate;
  content?: Record<string, unknown>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SubmitEmbeddedResponsePayload<T = any> = {
  success: boolean;
  message?: string;
  template?: {
    id: string;
    label: string;
  };
  content?: T;
};

export const AMPLIENCE_CONTENT_STUDIO_BASE_URL =
  "https://app.amplience.net/content-studio/";

export class AmplienceContentStudio {
  constructor(protected options: AmplienceContentStudioOptions = {}) {}

  public getContent(options?: GetContentOptions): Promise<GetContentResult> {
    const instance = this.createInstance<GetContentResult>();
    instance.activate({
      type: "getContent",
      options: options,
    });
    return instance.promise;
  }

  private createInstance<T = unknown>() {
    return new AmplienceContentStudioInstance<T>(this.options);
  }
}

class AmplienceContentStudioInstance<T = unknown> {
  public promise: Promise<T>;
  private _resolve?: (result: T) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _reject?: (reason: any) => void;
  protected isActive = false;
  protected connection: ServerConnection | undefined;
  protected instanceWindow: Window | undefined;
  protected pollingInterval: number | undefined;
  private activationPayload: unknown;

  constructor(protected options: AmplienceContentStudioOptions) {
    this.handleEvent = this.handleEvent.bind(this);
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  activate(payload: unknown) {
    this.activationPayload = payload;

    const {
      baseUrl = AMPLIENCE_CONTENT_STUDIO_BASE_URL,
      windowTarget = "_blank",
      windowFeatures,
    } = this.options;

    const newWindow = window.open(baseUrl, windowTarget, windowFeatures);
    if (!newWindow) {
      this.reject(new ApplicationBlockedError());
    } else {
      this.isActive = true;
      this.instanceWindow = newWindow;
      window.addEventListener("message", this.handleEvent);
      this.handleActivate();
      newWindow.focus();
      this.pollingInterval = window.setInterval(() => {
        if (newWindow.closed) {
          this.deactivate();
          this.reject(new ApplicationExitError());
        }
      }, 100);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected handleEvent(event: MessageEvent<any>) {
    if (event.data?.event === "requestActivationPayload") {
      this.handleActivate();
    } else if (event.data?.event === "submit") {
      this.handleSubmit(event.data.payload);
    }
  }

  protected handleActivate() {
    if (this.instanceWindow) {
      this.instanceWindow.postMessage(
        { event: "activate", payload: this.activationPayload },
        "*"
      );
    }
  }

  protected handleSubmit(payload: SubmitEmbeddedResponsePayload) {
    if (payload.success) {
      const { success, template, content } = payload;
      this.resolve({ success, template, content } as T);
    } else {
      this.reject(payload.message);
    }
    this.deactivate();
  }

  deactivate() {
    window.removeEventListener("message", this.handleEvent);
    if (this.instanceWindow) {
      this.instanceWindow.close();
    }
    clearInterval(this.pollingInterval);
  }

  protected resolve(value: T) {
    this._resolve && this._resolve(value);
    this._resolve = undefined;
    this._reject = undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected reject(reason: any) {
    this._reject && this._reject(reason);
    this._resolve = undefined;
    this._reject = undefined;
  }
}
