import { Mermaid } from "./mermaid";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Mermaid> = {
  title: "Components/Mermaid",
  component: Mermaid,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Mermaid>;

export const SequenceDiagram: Story = {
  args: {
    code: `
    sequenceDiagram
        Alice ->> Bob: Hello Bob, how are you?
        Bob-->>John: How about you John?
        Bob--x Alice: I am good thanks!
        Bob-x John: I am good thanks!
        Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

        Bob-->Alice: Checking with John...
        Alice->John: Yes... John, how are you?
    `,
  },
};

export const PieChart: Story = {
  args: {
    code: `
        pie title NETFLIX
        "Time spent looking for movie" : 90
        "Time spent watching it" : 10
        `,
  },
};

export const FlowChart: Story = {
  args: {
    code: `
        graph LR
        A[Square Rect] -- Link text --> B((Circle))
        A --> C(Round Rect)
        B --> D{Rhombus}
        C --> D
    `,
  },
};

export const Large: Story = {
  args: {
    code: `
        graph TB
            sq[Square shape] --> ci((Circle shape))

            subgraph A
                od>Odd shape]-- Two line<br/>edge comment --> ro
                di{Diamond with <br/> line break} -.-> ro(Rounded<br>square<br>shape)
                di==>ro2(Rounded square shape)
            end

            %% Notice that no text in shape are added here instead that is appended further down
            e --> od3>Really long text with linebreak<br>in an Odd shape]

            %% Comments after double percent signs
            e((Inner / circle<br>and some odd <br>special characters)) --> f(,.?!+-*ز)

            cyr[Cyrillic]-->cyr2((Circle shape Начало));

            classDef green fill:#9f6,stroke:#333,stroke-width:2px;
            classDef orange fill:#f96,stroke:#333,stroke-width:4px;
            class sq,e green
            class di orange
    `,
  },
};

export const SequenceDiagramAlt: Story = {
  args: {
    code: `
        sequenceDiagram
            loop Daily query
                Alice->>Bob: Hello Bob, how are you?
                alt is sick
                    Bob->>Alice: Not so good :(
                else is well
                    Bob->>Alice: Feeling fresh like a daisy
                end

                opt Extra response
                    Bob->>Alice: Thanks for asking
                end
            end
    `,
  },
};

export const SequenceDiagramLoop: Story = {
  args: {
    code: `
        sequenceDiagram
            participant Alice
            participant Bob
            Alice->>John: Hello John, how are you?
            loop Healthcheck
                John->>John: Fight against hypochondria
            end
            Note right of John: Rational thoughts<br/>prevail...
            John-->>Alice: Great!
            John->>Bob: How about you?
            Bob-->>John: Jolly good!
    `,
  },
};

export const GitGraph: Story = {
  args: {
    code: `
        gitGraph:
            commit "Ashish"
            branch newbranch
            checkout newbranch
            commit id:"1111"
            commit tag:"test"
            checkout main
            commit type: HIGHLIGHT
            commit
            merge newbranch
            commit
            branch b2
            commit
        `,
  },
};

export const StateDiagram: Story = {
  args: {
    code: `
        stateDiagram-v2
        [*] --> Active

        state Active {
            [*] --> NumLockOff
            NumLockOff --> NumLockOn : EvNumLockPressed
            NumLockOn --> NumLockOff : EvNumLockPressed
            --
            [*] --> CapsLockOff
            CapsLockOff --> CapsLockOn : EvCapsLockPressed
            CapsLockOn --> CapsLockOff : EvCapsLockPressed
            --
            [*] --> ScrollLockOff
            ScrollLockOff --> ScrollLockOn : EvScrollLockPressed
            ScrollLockOn --> ScrollLockOff : EvScrollLockPressed
        }
    `,
  },
};

export const ClassDiagram: Story = {
  args: {
    code: `
        classDiagram
            note "From Duck till Zebra"
            Animal <|-- Duck
            note for Duck "can fly\ncan swim\ncan dive\ncan help in debugging"
            Animal <|-- Fish
            Animal <|-- Zebra
            Animal : +int age
            Animal : +String gender
            Animal: +isMammal()
            Animal: +mate()
            class Duck{
                +String beakColor
                +swim()
                +quack()
            }
            class Fish{
                -int sizeInFeet
                -canEat()
            }
            class Zebra{
                +bool is_wild
                +run()
            }
    `,
  },
};
