export const sampleTemplate = {
  name: "Sample Template",
  pages: [
    {
      name: "Home Page",
      metadata: {
        title: "Welcome to our website"
      },
      content: {
        rows: [
          {
            id: "row-1",
            columns: [
              {
                id: "col-1",
                type: "col-12",
                content: [
                  {
                    id: "block-1",
                    blocktype: "text",
                    properties: [
                      { name: "fontSize", value: "24px" }
                    ],
                    attributes: [
                      { name: "class", value: "font-bold" }
                    ],
                    innerHtmlOrText: "<h1>Welcome to our page editor</h1>"
                  }
                ]
              }
            ]
          },
          {
            id: "row-2",
            columns: [
              {
                id: "col-2",
                type: "col-6",
                content: [
                  {
                    id: "block-2",
                    blocktype: "text",
                    properties: [],
                    attributes: [],
                    innerHtmlOrText: "<p>This is the left column content.</p>"
                  }
                ]
              },
              {
                id: "col-3",
                type: "col-6",
                content: [
                  {
                    id: "block-3",
                    blocktype: "text",
                    properties: [],
                    attributes: [],
                    innerHtmlOrText: "<p>This is the right column content.</p>"
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ]
};
