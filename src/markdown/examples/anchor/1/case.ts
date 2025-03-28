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
            id: "Text",
            value: "world!",
          },
        ],
        id: "Anchor",
        value: "/src",
      },
    ],
    id: "Paragraph",
  },
];
