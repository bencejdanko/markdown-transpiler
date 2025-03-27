import { Token } from "@transpiler/mod.ts";

const tokens: Token[] = [
    {
        id: "Paragraph",
        children: [
            {
                id: "Text",
                value: "A multi"
            },

            {
                id: "Break"
            },
            
            {
                id: "Text",
                value: "line paragraph"
            }
        ]
    }
]

export default tokens