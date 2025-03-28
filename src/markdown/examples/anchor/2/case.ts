export default [
  {
    children: [
      {
        id: "Text",
        value: "Hello, ",
      },
      {
        children: [
          {
            children: [
              {
                id: "Text",
                value: "World!",
              },
            ],
            id: "Emphasis",
          },
        ],
        id: "Anchor",
        value: "/src",
      },
    ],
    id: "Paragraph",
  },
];
