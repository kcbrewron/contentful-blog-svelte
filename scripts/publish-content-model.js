import contentful from 'contentful-management';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function publishContentModel() {
  try {
    // Initialize Contentful Management Client
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
    });

    // Get the space
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT);

    // Content Type Definitions
    const contentTypes = [
      {
        id: 'page',
        name: 'Page',
        description: 'A single page in the website',
        fields: [
          {
            id: 'title',
            name: 'Title',
            type: 'Symbol',
            required: true
          },
          {
            id: 'slug',
            name: 'Slug',
            type: 'Symbol',
            required: true,
            validations: [{ unique: true }]
          },
          {
            id: 'sections',
            name: 'Sections',
            type: 'Array',
            items: {
              type: 'Link',
              validations: [{ linkContentType: ['paragraphBlock', 'imageContentBlock', 'blockQuote', 'codeBlock'] }],
              linkType: 'Entry'
            }
          },
          {
            id: 'seo',
            name: 'SEO Metadata',
            type: 'Object',
            required: false
          }
        ]
      },
      {
        id: 'navigationItem',
        name: 'Navigation Item',
        description: 'A single navigation link',
        displayField: 'label',
        fields: [
          {
            id: 'label',
            name: 'Label',
            type: 'Symbol',
            required: true
          },
          {
            id: 'url',
            name: 'URL',
            type: 'Symbol',
            required: true
          }
        ]
      },
      {
        id: 'navigationBar',
        name: 'Navigation Bar',
        description: 'Site-wide navigation menu',
        displayField: 'title',
        fields: [
          {
            id: 'title',
            name: 'Title',
            type: 'Symbol',
            required: true
          },
          {
            id: 'navigationItems',
            name: 'Navigation Items',
            type: 'Array',
            items: {
              type: 'Link',
              linkType: 'Entry',
              validations: [
                { linkContentType: ['navigationItem'] }
              ]
            }
          }
        ]
      },
      {
        id: 'paragraphBlock',
        name: 'Paragraph Block',
        description: 'A text paragraph section',
        displayField: 'heading',
        fields: [
          {
            id: 'heading',
            name: 'Heading',
            type: 'Symbol',
            required: true
          },
          {
            id: 'content',
            name: 'Content',
            type: 'Text',
            required: true
          },
          {
            id: 'alignment',
            name: 'Text Alignment',
            type: 'Symbol',
            validations: [{ in: ['left', 'center', 'right'] }],
            required: false
          }
        ]
      },
      {
        id: 'imageContentBlock',
        name: 'Image + Content Block',
        description: 'A block with an image and accompanying text',
        displayField: 'heading',
        fields: [
          {
            id: 'heading',
            name: 'Heading',
            type: 'Symbol',
            required: true
          },
          {
            id: 'image',
            name: 'Image',
            type: 'Link',
            linkType: 'Asset',
            required: true
          },
          {
            id: 'content',
            name: 'Content',
            type: 'Text',
            required: false
          },
          {
            id: 'imagePosition',
            name: 'Image Position',
            type: 'Symbol',
            validations: [{ in: ['left', 'right'] }],
            required: true
          }
        ]
      },
      {
        id: 'blockQuote',
        name: 'Block Quote',
        description: 'A highlighted quote section',
        displayField: 'author',
        fields: [
          {
            id: 'author',
            name: 'Quote Author',
            type: 'Symbol',
            required: true
          },
          {
            id: 'quote',
            name: 'Quote Text',
            type: 'Text',
            required: true
          }
        ]
      },
      {
        id: 'codeBlock',
        name: 'Code Block',
        description: 'A section for displaying code snippets',
        displayField: 'caption',
        fields: [
          {
            id: 'caption',
            name: 'Caption',
            type: 'Symbol',
            required: true
          },
          {
            id: 'language',
            name: 'Programming Language',
            type: 'Symbol',
            required: true
          },
          {
            id: 'code',
            name: 'Code Snippet',
            type: 'Text',
            required: true
          }
        ]
      },
      {
        id: 'category',
        name: 'Category',
        description: 'Blog category for content hub/landing pages',
        displayField: 'name',
        fields: [
          {
            id: 'name',
            name: 'Name',
            type: 'Symbol',
            required: true,
            validations: [
              { unique: true },
              { size: { max: 50 } }
            ]
          },
          {
            id: 'slug',
            name: 'Slug',
            type: 'Symbol',
            required: true,
            validations: [
              { unique: true },
              { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }
            ]
          },
          {
            id: 'description',
            name: 'Description',
            type: 'Text',
            required: true,
            validations: [
              { size: { max: 500 } }
            ]
          },
          {
            id: 'heroTitle',
            name: 'Hero Title',
            type: 'Symbol',
            required: true,
            validations: [
              { size: { max: 100 } }
            ]
          },
          {
            id: 'heroDescription',
            name: 'Hero Description',
            type: 'Text',
            required: false,
            validations: [
              { size: { max: 250 } }
            ]
          },
          {
            id: 'heroImage',
            name: 'Hero Image',
            type: 'Link',
            linkType: 'Asset',
            required: false
          },
          {
            id: 'themeColor',
            name: 'Theme Color',
            type: 'Symbol',
            required: true,
            validations: [
              { in: ['blue', 'green', 'purple', 'red', 'orange'] }
            ]
          },
          {
            id: 'featuredPosts',
            name: 'Featured Posts',
            type: 'Array',
            items: {
              type: 'Link',
              linkType: 'Entry',
              validations: [
                { linkContentType: ['blogPost'] }
              ]
            },
            required: false
          },
          {
            id: 'seoTitle',
            name: 'SEO Title',
            type: 'Symbol',
            required: true,
            validations: [
              { size: { max: 60 } }
            ]
          },
          {
            id: 'seoDescription',
            name: 'SEO Description',
            type: 'Text',
            required: true,
            validations: [
              { size: { max: 160 } }
            ]
          },
          {
            id: 'flexibleSections',
            name: 'Flexible Sections',
            type: 'Array',
            items: {
              type: 'Link',
              linkType: 'Entry',
              validations: [
                { linkContentType: ['paragraphBlock', 'imageContentBlock', 'blockQuote', 'codeBlock'] }
              ]
            },
            required: false
          }
        ]
      },
      {
        id: 'blogPost',
        name: 'Blog Post',
        description: 'Individual blog article',
        displayField: 'title',
        fields: [
          {
            id: 'title',
            name: 'Title',
            type: 'Symbol',
            required: true,
            validations: [
              { size: { max: 100 } }
            ]
          },
          {
            id: 'slug',
            name: 'Slug',
            type: 'Symbol',
            required: true,
            validations: [
              { unique: true },
              { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }
            ]
          },
          {
            id: 'excerpt',
            name: 'Excerpt',
            type: 'Text',
            required: true,
            validations: [
              { size: { max: 250 } }
            ]
          },
          {
            id: 'category',
            name: 'Category',
            type: 'Link',
            linkType: 'Entry',
            validations: [
              { linkContentType: ['category'] }
            ],
            required: true
          },
          {
            id: 'author',
            name: 'Author',
            type: 'Link',
            linkType: 'Entry',
            validations: [
              { linkContentType: ['author'] }
            ],
            required: true
          },
          {
            id: 'publishedDate',
            name: 'Published Date',
            type: 'Date',
            required: true
          },
          {
            id: 'updatedDate',
            name: 'Updated Date',
            type: 'Date',
            required: false
          },
          {
            id: 'featuredImage',
            name: 'Featured Image',
            type: 'Link',
            linkType: 'Asset',
            required: true
          },
          {
            id: 'content',
            name: 'Content',
            type: 'Array',
            items: {
              type: 'Link',
              linkType: 'Entry',
              validations: [
                { linkContentType: ['paragraphBlock', 'imageContentBlock', 'blockQuote', 'codeBlock'] }
              ]
            },
            required: true
          },
          {
            id: 'tags',
            name: 'Tags',
            type: 'Array',
            items: { type: 'Symbol' },
            required: false,
            validations: [
              { size: { max: 5 } }
            ]
          },
          {
            id: 'estimatedReadingTime',
            name: 'Estimated Reading Time',
            type: 'Integer',
            required: true,
            validations: [
              { range: { min: 1, max: 30 } }
            ]
          },
          {
            id: 'seoTitle',
            name: 'SEO Title',
            type: 'Symbol',
            required: true,
            validations: [
              { size: { max: 60 } }
            ]
          },
          {
            id: 'seoDescription',
            name: 'SEO Description',
            type: 'Text',
            required: true,
            validations: [
              { size: { max: 160 } }
            ]
          }
        ]
      },
      // Note: Using existing 'author' content type already in Contentful space
      {
        id: 'externalArticle',
        name: 'External Article',
        description: 'Link to an article published on an external platform (e.g., Medium)',
        displayField: 'title',
        fields: [
          {
            id: 'title',
            name: 'Title',
            type: 'Symbol',
            required: true,
            validations: [
              { size: { max: 100 } }
            ]
          },
          {
            id: 'excerpt',
            name: 'Excerpt',
            type: 'Text',
            required: true,
            validations: [
              { size: { max: 250 } }
            ]
          },
          {
            id: 'externalUrl',
            name: 'External URL',
            type: 'Symbol',
            required: true,
            validations: [
              {
                regexp: {
                  pattern: '^(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$'
                }
              }
            ]
          },
          {
            id: 'platform',
            name: 'Platform',
            type: 'Symbol',
            required: true,
            validations: [
              { in: ['Medium', 'Dev.to', 'Hashnode', 'Other'] }
            ]
          },
          {
            id: 'category',
            name: 'Category',
            type: 'Link',
            linkType: 'Entry',
            validations: [
              { linkContentType: ['category'] }
            ],
            required: true
          },
          {
            id: 'author',
            name: 'Author',
            type: 'Link',
            linkType: 'Entry',
            validations: [
              { linkContentType: ['author'] }
            ],
            required: true
          },
          {
            id: 'publishedDate',
            name: 'Published Date',
            type: 'Date',
            required: true
          },
          {
            id: 'featuredImage',
            name: 'Featured Image',
            type: 'Link',
            linkType: 'Asset',
            required: false
          },
          {
            id: 'tags',
            name: 'Tags',
            type: 'Array',
            items: { type: 'Symbol' },
            required: false,
            validations: [
              { size: { max: 5 } }
            ]
          },
          {
            id: 'estimatedReadingTime',
            name: 'Estimated Reading Time',
            type: 'Integer',
            required: false,
            validations: [
              { range: { min: 1, max: 30 } }
            ]
          }
        ]
      }
    ];

    // Function to create or update and publish a content type
    async function createOrUpdateContentType(contentTypeDefinition) {
      try {
        let contentType;
        const contentTypeId = contentTypeDefinition.id;

        try {
          // Try to get existing content type
          contentType = await environment.getContentType(contentTypeId);
          console.log(`Updating existing content type: ${contentTypeId}`);

          // Update the content type
          contentType.name = contentTypeDefinition.name;
          contentType.description = contentTypeDefinition.description;
          contentType.fields = contentTypeDefinition.fields;
          if (contentTypeDefinition.displayField) {
            contentType.displayField = contentTypeDefinition.displayField;
          }

          contentType = await contentType.update();
        } catch (error) {
          // If content type doesn't exist, create a new one
          console.log(`Creating new content type: ${contentTypeId}`);

          // Create content type with ID as separate parameter
          const payload = {
            name: contentTypeDefinition.name,
            description: contentTypeDefinition.description,
            fields: contentTypeDefinition.fields
          };

          if (contentTypeDefinition.displayField) {
            payload.displayField = contentTypeDefinition.displayField;
          }

          contentType = await environment.createContentTypeWithId(contentTypeId, payload);
        }

        // Publish the content type
        contentType = await contentType.publish();
        console.log(`Successfully published content type: ${contentTypeId}`);

        return contentType;
      } catch (error) {
        console.error(`Error processing content type ${contentTypeDefinition.id}:`, error);
        throw error;
      }
    }

    // Process all content types
    for (const contentType of contentTypes) {
      await createOrUpdateContentType(contentType);
    }

    console.log('Content model publication completed successfully!');
  } catch (error) {
    console.error('Error publishing content model:', error);
    process.exit(1);
  }
}

publishContentModel();