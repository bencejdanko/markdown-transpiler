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
                        value: "A multi"
                    },
                    {
                        id: "Text",
                        value: " "
                    },
                    {
                        id: "Text",
                        value: "line emphasis"
                    }
                ]
            }
        ]
    }
]

export default tokens;