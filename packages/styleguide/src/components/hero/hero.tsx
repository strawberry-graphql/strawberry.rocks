import { Button } from "../button/button";
import { Codebox } from "../codebox/codebox";
import { Display } from "../typography/display";
import Balancer from "react-wrap-balancer";

const code = `<span class="line"><span style="color: var(--shiki-token-keyword)">import</span><span style="color: var(--shiki-color-text)"> strawberry</span></span>
<span class="line"></span>
<span class="line"><span style="color: var(--shiki-token-function)">@strawberry</span><span style="color: var(--shiki-token-punctuation)">.</span><span style="color: var(--shiki-token-function)">type</span></span>
<span class="line"><span style="color: var(--shiki-token-keyword)">class</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-function)">User</span><span style="color: var(--shiki-color-text)">:</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">    name</span><span style="color: var(--shiki-token-punctuation)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">str</span></span>
<span class="line"></span>
<span class="line"><span style="color: var(--shiki-color-text)">    </span><span style="color: var(--shiki-token-function)">@strawberry</span><span style="color: var(--shiki-token-punctuation)">.</span><span style="color: var(--shiki-token-function)">field</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">    </span><span style="color: var(--shiki-token-keyword)">def</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-function)">is_admin</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-parameter)">self</span><span style="color: var(--shiki-color-text)">) </span><span style="color: var(--shiki-token-punctuation)">-&gt;</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">bool</span><span style="color: var(--shiki-color-text)">:</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">        </span><span style="color: var(--shiki-token-keyword)">return</span><span style="color: var(--shiki-color-text)"> self</span><span style="color: var(--shiki-token-punctuation)">.</span><span style="color: var(--shiki-color-text)">name </span><span style="color: var(--shiki-token-keyword)">==</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">&quot;Patrick&quot;</span></span>
<span class="line"></span>`;

export const Hero = () => {
  return (
    <div className="p-16 md:px-32 text-center space-y-48 max-w-screen-lg mx-auto">
      <Display>
        <Balancer>
          The new <span className="text-strawberry">GraphQL library</span> for
          Python 3, inspired by dataclasses.
        </Balancer>
      </Display>

      <Button as="a" href="/docs">
        Get Started
      </Button>

      <div className="text-left mx-auto max-w-2xl">
        <Codebox>
          <code dangerouslySetInnerHTML={{ __html: code }} />
        </Codebox>
      </div>
    </div>
  );
};
