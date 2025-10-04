import contentful from 'contentful-management';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function listContentTypes() {
  try {
    // Initialize Contentful Management Client
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
    });

    // Get the space
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT);

    // Fetch content types
    const { items: contentTypes } = await environment.getContentTypes();

    console.log('Existing Content Types:');
    contentTypes.forEach(type => {
      console.log(`- ${type.name} (ID: ${type.sys.id})`);
    });

  } catch (error) {
    console.error('Error listing content types:', error);
    process.exit(1);
  }
}

listContentTypes();