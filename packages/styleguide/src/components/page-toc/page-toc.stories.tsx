import { Heading } from "../typography/heading";
import { PageTOC } from "./page-toc";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PageTOC> = {
  title: "Components/Page TOC",
  component: PageTOC,
};

export default meta;
type Story = StoryObj<typeof PageTOC>;

export const Default: Story = {
  args: {
    items: new Array(20).fill(0).map((_, i) => ({
      id: `section-${i}`,
      title: `Section ${i}`,
    })),
  },
  render: (args) => (
    <div className="grid grid-cols-2">
      <div>
        {args.items.map((item) => (
          <div key={item.id} id={item.id}>
            <Heading>{item.title}</Heading>
            {new Array(20).fill(0).map((_, i) => (
              <p key={i}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
                recusandae odit reiciendis iste, culpa corporis corrupti, minus
                fuga quisquam quae fugiat ab dolor ea inventore. Maxime ipsam
                quae labore veritatis.
              </p>
            ))}
          </div>
        ))}
      </div>

      <PageTOC {...args} />
    </div>
  ),
};
