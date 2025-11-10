#!/usr/bin/env node

import { processMarkdownFile } from './generate-json.js'

async function test() {
	console.log('Testing frontmatter parsing...\n')
	
	// Test with a file that has frontmatter
	const testFile = '/Users/afnizarnur/Development/pensil-ajaib-data/Prompts/variant-explanation.md'
	
	try {
		const result = await processMarkdownFile(testFile)
		
		console.log('File:', result.filePath)
		console.log('Has frontmatter:', result.hasFrontmatter)
		console.log('Metadata:', result.metadata)
		console.log('Original size:', result.originalSize, 'bytes')
		console.log('Stripped size:', result.strippedSize, 'bytes')
		console.log('Size reduction:', result.originalSize - result.strippedSize, 'bytes')
		console.log('\nFirst 200 chars of stripped content:')
		console.log(result.content.substring(0, 200))
	} catch (error) {
		console.error('Test failed:', error.message)
		process.exit(1)
	}
}

test()
