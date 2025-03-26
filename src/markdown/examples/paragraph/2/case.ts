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
                        value: "Hello, world!"
                    }
                ]
            }
        ]
    }
]

export default tokens;