let xmlDoc;

async function fetchXMLData() {
    try {
      const response = await fetch('class_catalog.xml');
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
  

      const classes = xmlDoc.getElementsByTagName('CLASS');
      console.log(`Found ${classes.length} classes`);
  
      const tableBody = document.querySelector('#resultsTable tbody');
      tableBody.innerHTML = ''; // Clear existing results

      xmlDoc = parser.parseFromString(xmlText, "application/xml");
  
      Array.from(classes).forEach((course) => {
        const name = course.getElementsByTagName('COURSETITLE')[0].textContent.toLowerCase();
        const number = course.getElementsByTagName('COURSENUMBER')[0].textContent;
        const category = course.getElementsByTagName('DEPT')[0].textContent.toLowerCase();
        const days = course.getElementsByTagName('DAYS')[0].textContent;
        const campus = course.getElementsByTagName('CAMPUS')[0].textContent;
  
        const row = document.createElement('tr');
        row.innerHTML = `<td>${name}</td><td>${number}</td><td>${category}</td><td>${days}</td><td>${campus}</td>`;
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error('Failed to load XML data:', err);
    }
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    await fetchXMLData();
  });
  
  document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Search form found and event listener attached');
  
    const searchString = document.getElementById('searchString').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const tableBody = document.querySelector('#resultsTable tbody');
  
    tableBody.innerHTML = '';

    //add error catcher
    if (!xmlDoc) {
      console.error('XML data not loaded');
      return;
    }
  
    const classes = xmlDoc.getElementsByTagName('CLASS');
    Array.from(classes).forEach((course) => {
      const name = course.getElementsByTagName('COURSETITLE')[0].textContent.toLowerCase();
      const number = course.getElementsByTagName('COURSENUMBER')[0].textContent;
      const category = course.getElementsByTagName('DEPT')[0].textContent.toLowerCase();
      const days = course.getElementsByTagName('DAYS')[0].textContent;
      const campus = course.getElementsByTagName('CAMPUS')[0].textContent;
  
      if (
        (!searchString || name.includes(searchString)) &&
        (!categoryFilter || category === categoryFilter.toLowerCase())
      ) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${name}</td><td>${number}</td><td>${category}</td><td>${days}</td><td>${campus}</td>`;
        tableBody.appendChild(row);
      }
    });
  });
  