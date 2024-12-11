let xmlDoc;

function fetchXMLData() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const parser = new DOMParser();
            xmlDoc = parser.parseFromString(this.responseText, "application/xml");

            const classes = xmlDoc.getElementsByTagName('CLASS');
            console.log(`Found ${classes.length} classes`);
        }
    };
    xhr.open("GET", "class_catalog.xml", true);
    xhr.send();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchXMLData();
});

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Search form found and event listener attached');

    const searchString = document.getElementById('searchString').value.trim().toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value.toLowerCase();
    const tableBody = document.querySelector('#resultsTable tbody');

    tableBody.innerHTML = '';

    if (!xmlDoc) {
        console.error('XML data not loaded');
        return;
    }

    const classes = xmlDoc.getElementsByTagName('CLASS');
    Array.from(classes).forEach((course) => {
        const name = course.getElementsByTagName('COURSETITLE')[0].textContent;
        const number = course.getElementsByTagName('COURSENUMBER')[0].textContent;
        const category = course.getElementsByTagName('DEPT')[0].textContent;
        const days = course.getElementsByTagName('DAYS')[0].textContent;
        const campus = course.getElementsByTagName('CAMPUS')[0].textContent;

        if (
          (name.toLowerCase().includes(searchString) ||
          number.toLowerCase().includes(searchString) ||
          days.toLowerCase().includes(searchString) ||
          campus.toLowerCase().includes(searchString) ||
          category.toLowerCase().includes(searchString)) &&
         ((!categoryFilter || categoryFilter === "") ||
         (categoryFilter === "programming" && name.toLowerCase().includes("programming")) ||
         (categoryFilter === "days" && days.toLowerCase().includes(searchString)))
        ) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${name}</td><td>${number}</td><td>${category}</td><td>${days}</td><td>${campus}</td>`;
            tableBody.appendChild(row);
        }
    });
});
