
# IPFS management API
### whats possible:
1. Node management
    - Initialize an IPFS node
    - Stop the node
    - get node status 
    - get node peers
    - get node current config
    - get bitswap routing info
2. File management
    - Upload single/multiple files
    - Upload a remote resource using url
    - Get file metadata by Conten Identifier
    - Rename file (local version only) by CID
    - Delete a file (local version only) by CID
    - Download a file content by CID

## to install required packages
`npm ci `

## to start API
` npm run start`

## Swagger API docs:
` http://localhost:3000/docs/ `