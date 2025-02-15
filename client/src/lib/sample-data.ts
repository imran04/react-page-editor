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
            styles: {},
            attributes: {},
            columns: [
              {
                id: "col-1",
                type: "col-12",
                styles: {},
                attributes: {},
                content: [
                  {
                    id: "block-1",
                    blocktype: "text",
                    styles: {},
                    attributes: {},
                    innerHtmlOrText: "<h1>Welcome to our page editor</h1>"
                  }
                ]
              }
            ]
          },
          {
            id: "row-2",
            styles: {},
            attributes: {},
            columns: [
              {
                id: "col-2",
                type: "col-6",
                styles: {},
                attributes: {},
                content: [
                  {
                    id: "block-2",
                    blocktype: "text",
                    styles: {},
                    attributes: {},
                    innerHtmlOrText: "<p>This is the left column content.</p>"
                  }
                ]
              },
              {
                id: "col-3",
                type: "col-6",
                styles: {},
                attributes: {},
                content: [
                  {
                    id: "block-3",
                    blocktype: "text",
                    styles: {},
                    attributes: {},
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