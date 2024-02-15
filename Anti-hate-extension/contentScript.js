// Flag to track blur state
let blurEnabled = true;

// Function to fetch data from server.js and blur/unblur the results
async function fetchDataAndToggleBlur() {
  try {
    // Fetch data from server.js
    const response = await fetch('http://localhost:3000/scrape?url=' + window.location.href);
    if (!response.ok) {
      console.log('Failed to fetch data from server');
    }
    const data = await response.json();
    console.log('Data fetched successfully:', data);

    if (data.success == false){
      console.log('No hate speech detected');
    }

    // Apply blur effect to matching text or unblur based on flag
    const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = textNodes.currentNode; node; node = textNodes.nextNode()) {
      if (node.nodeValue && typeof node.nodeValue === 'string') {
        const nodeText = node.nodeValue.trim();
        data.forEach(phrase => {
          if (nodeText.includes(phrase)) {
            if (blurEnabled) {
              // Apply blur effect
              node.parentNode.style.filter = 'blur(5px)';
              // Set cursor style to pointer
              node.parentNode.style.cursor = 'pointer';
            } else {
              // Remove blur effect
              node.parentNode.style.filter = 'none';
              // Restore default cursor
              node.parentNode.style.cursor = 'auto';
            }
            // Add hover effect
            node.parentNode.style.transition = 'filter 0.3s ease';
            node.parentNode.addEventListener('mouseenter', function() {
              this.style.filter = 'blur(0.5px)';
            });
            node.parentNode.addEventListener('mouseleave', function() {
              if (blurEnabled) {
                this.style.filter = 'blur(5px)';
              } else {
                this.style.filter = 'none';
              }
            });
          }
        });
      }
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
}

// Fetch data and apply blur effect on page load
fetchDataAndToggleBlur();
