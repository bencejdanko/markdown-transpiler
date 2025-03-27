import { Token } from "@transpiler/mod.ts";

const tokens: Token[] = [
    {
        id: "Paragraph",
        children: [
            {
                id: "Emphasis",
                children: [
                    {
                        id: "Text",
                        value: "Hard break"
                    },
                    {
                        id: "Break",
                    },
                    {
                        id: "Text",
                        value: "in emphasis"
                    }
                ]
            }
        ]
    }
]

export default tokens;