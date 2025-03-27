import { Token } from "@transpiler/mod.ts";

const tokens: Token[] = [
    {
        id: "Blockquote",
        children: [
            {
                id: "Text",
                value: "Basic blockquote, with multiple lines."
            }
        ],
        value: undefined
    }
]

export default tokens;