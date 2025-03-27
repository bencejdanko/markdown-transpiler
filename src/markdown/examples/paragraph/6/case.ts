import { Token } from "@transpiler/mod.ts";

const tokens: Token[] = [
    {
        id: "Paragraph",
        children: [{
            id: "Text",
            value: "A paragraph"
        }]

    }, 
    {
        id: "Paragraph",
        children: [{
            id: "Text",
            value: "followed by another paragraph"
        }]
    }
]

export default tokens;