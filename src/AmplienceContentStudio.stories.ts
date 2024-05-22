import {
  AmplienceContentStudio,
  AmplienceContentStudioOptions,
} from "./AmplienceContentStudio";

export default {
  title: "AmplienceContentStudio",
  tags: ["autodocs"],
  render: ({ options }: { options: AmplienceContentStudioOptions }) => {
    const studio = new AmplienceContentStudio(options);
    const launch = document.createElement("button");
    launch.innerText = "Launch";
    launch.onclick = async () => {
      studio.getContent().then(
        (result) => {
          console.log(`resolved: `, result);
        },
        (error) => {
          console.log(`rejected: `, error);
        }
      );
    };
    return launch;
  },
  argTypes: {},
};

export const Default = {
  args: {
    options: {},
  },
};
