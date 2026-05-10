const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/dashboard/dashboard.component.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace Activity interface
content = content.replace(/interface Activity \{[^}]+\}/, `interface Activity {
  type: string;
  icon: string;
  iconClass?: string;
  text: string;
  time: string;
  actionUrl?: string;
  thumbnailUrl?: string;
  isRead?: boolean;
}`);

const helperMethods = `
  decodeNotificationText(value: string): string {
    const source = (value || '').trim();
    if (!source) return '';
    try {
      return decodeURIComponent(source);
    } catch {
      return source.replace(/%20/g, ' ');
    }
  }

  buildActionUrl(notification: any): string {
    if (notification.actionUrl) return notification.actionUrl;
    const postId = notification.targetPostId || notification.metadata?.['postId'];
    const commentId = notification.targetCommentId || notification.metadata?.['commentId'];
    const reelId = notification.targetReelId || notification.metadata?.['reelId'];

    if (reelId) return '/reels?reelId=' + reelId;
    if (notification.targetStoryId) return '/stories';
    if (postId) return '/posts?postId=' + postId + (commentId ? '&commentId=' + commentId : '');
    if (notification.type.includes('follow')) return '/user/' + notification.senderEmail;
    if (notification.type.includes('premium')) return '/payments';
    return '/dashboard';
  }

  getThumbnailUrl(notification: any): string | undefined {
    const direct = notification.thumbnailUrl || '';
    if (direct) return direct;
    const metadata = notification.metadata || {};
    const fallback = metadata['thumbnailUrl'] || metadata['previewUrl'] || metadata['postThumbnailUrl'] || metadata['mediaUrl'];
    return typeof fallback === 'string' ? fallback : undefined;
  }
}
`;

// Replace end of class and add methods
content = content.replace(/timeAgo\(dateStr: string\): string \{([\s\S]*?)return Math\.floor\(diff \/ 86400\) \+ 'd ago';\r?\n\s*\}\r?\n\}/, (match, p1) => {
  return `timeAgo(dateStr: string): string {${p1}return Math.floor(diff / 86400) + 'd ago';\n  }\n${helperMethods}`;
});

fs.writeFileSync(file, content);
console.log('done');
