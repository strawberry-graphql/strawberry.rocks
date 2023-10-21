import { Codebox } from "./codebox";
import { SideBySide } from "./side-by-side";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SideBySide> = {
  title: "Components/Codebox/SideBySide",
  component: SideBySide,
  parameters: {},
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SideBySide>;

const pythonExample = `<span class="line"><span style="color: var(--shiki-token-keyword)">import</span><span style="color: var(--shiki-color-text)"> strawberry</span></span>
<span class="line"></span>
<span class="line"><span style="color: var(--shiki-token-function)">@strawberry</span><span style="color: var(--shiki-token-punctuation)">.</span><span style="color: var(--shiki-token-function)">type</span></span>
<span class="line"><span style="color: var(--shiki-token-keyword)">class</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-function)">User</span><span style="color: var(--shiki-color-text)">:</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">    name</span><span style="color: var(--shiki-token-punctuation)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">str</span></span>
<span class="line"></span>
<span class="line"><span style="color: var(--shiki-color-text)">    </span><span style="color: var(--shiki-token-function)">@strawberry</span><span style="color: var(--shiki-token-punctuation)">.</span><span style="color: var(--shiki-token-function)">field</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">    </span><span style="color: var(--shiki-token-keyword)">def</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-function)">is_admin</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-parameter)">self</span><span style="color: var(--shiki-color-text)">) </span><span style="color: var(--shiki-token-punctuation)">-&gt;</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">bool</span><span style="color: var(--shiki-color-text)">:</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">        </span><span style="color: var(--shiki-token-keyword)">return</span><span style="color: var(--shiki-color-text)"> self</span><span style="color: var(--shiki-token-punctuation)">.</span><span style="color: var(--shiki-color-text)">name </span><span style="color: var(--shiki-token-keyword)">==</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">&quot;Patrick&quot;</span></span>
<span class="line"></span>`;

const graphqlExample = `
<span class="line"><span style="color: var(--shiki-token-keyword)">query</span><span style="color: var(--shiki-color-text)"> {</span></span>
<span class="line"><span style="color: var(--shiki-token-comment)">  # this is a comment</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">  user(id: </span><span style="color: var(--shiki-token-constant)">1</span><span style="color: var(--shiki-color-text)">) {</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">    name</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">    email</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">  }</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">}</span></span>
`;

export const Default: Story = {
  args: {
    children: (
      <>
        <Codebox>
          <code dangerouslySetInnerHTML={{ __html: pythonExample }} />
        </Codebox>
        <Codebox>
          <code dangerouslySetInnerHTML={{ __html: graphqlExample }} />
        </Codebox>
      </>
    ),
  },
};
