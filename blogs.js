async function loadPosts() {
    const container = document.getElementById('posts-container');
    const posts = await fetch('posts').then(res => res.text());
  
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(posts, 'text/html');
    const links = [...htmlDoc.querySelectorAll('a')];
  
    const postFiles = links
      .map(link => link.getAttribute('href'))
      .filter(href => href.endsWith('.md'));
  
    postFiles.reverse(); // Newest first
  
    for (const file of postFiles) {
      const response = await fetch('posts/' + file);
      const text = await response.text();
      const title = (text.match(/title:\s*(.*)/) || [])[1] || "Untitled";
      const date = (text.match(/date:\s*(.*)/) || [])[1] || "";
      const image = (text.match(/image:\s*(.*)/) || [])[1] || "";
      const bodyMatch = text.match(/body:\s*(.*)/s);
      const body = bodyMatch ? bodyMatch[1].trim().replace(/[\r\n]+/g, '<br>') : "";
  
      const card = document.createElement('div');
      card.className = 'first-card';
      card.innerHTML = `
        <img src="${image}" style="width: 300px;">
        <h2 style="color: black; margin-top: 20px;">${title}</h2>
        <time style="color: black; align-self: flex-start; padding-top: 10px;">
          <img src="dateicon.png" style="width: 20px;"> ${new Date(date).toLocaleDateString('en-GB')}
        </time>
        <p style="color: black; margin-top: 10px;">${body}</p>
      `;
      container.appendChild(card);
    }
  }
  
  loadPosts();
  