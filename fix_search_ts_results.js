const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/search/search.component.ts';
let content = fs.readFileSync(file, 'utf8');

// Sync postResults inside searchByTag
content = content.replace(/this\.hashtagPosts\.push\(post\);/g, 'this.hashtagPosts.push(post);\n                this.postResults.push(post);');
content = content.replace(/this\.hashtagPosts = \[\];/g, 'this.hashtagPosts = [];\n        this.postResults = [];');

// Sync reelResults inside searchByTag
content = content.replace(/this\.hashtagReels = data\.filter\(r => r\.caption && r\.caption\.toLowerCase\(\)\.includes\('#' \+ tagLower\)\);/g, "this.hashtagReels = data.filter(r => r.caption && r.caption.toLowerCase().includes('#' + tagLower));\n        this.reelResults = this.hashtagReels;");
content = content.replace(/error: \(\) => this\.hashtagReels = \[\]/g, 'error: () => { this.hashtagReels = []; this.reelResults = []; }');

fs.writeFileSync(file, content);
console.log('done');
