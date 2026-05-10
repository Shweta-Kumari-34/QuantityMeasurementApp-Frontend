const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/search/search.component.scss';
let content = fs.readFileSync(file, 'utf8');

const getStartedStyle = `
.get-started-btn {
  padding: 12px 28px;
  font-size: 15px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  border: none;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }
}

.guest-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
`;

if (!content.includes('.get-started-btn')) {
    content = content.replace('.guest-banner-content h2 {', getStartedStyle + '\n.guest-banner-content h2 {');
    fs.writeFileSync(file, content);
}
console.log('done');
