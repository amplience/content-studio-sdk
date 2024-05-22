export class ApplicationExitError extends Error {
  constructor() {
    super("Application was exited by the user");
  }
}
