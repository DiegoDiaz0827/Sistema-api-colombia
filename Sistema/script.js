const API_BASE = "https://api-colombia.com/api/v1"

const departmentSelect = document.getElementById("departments");
const content = document.getElementById("content");


async function loadDepartments(){
 const res = await fetch(`${API_BASE}/Department`);
 const departments = await res.json();

 departmentSelect.innerHTML = `<option value="">--seleccione un departamento--</option>`;

 departments.forEach(dep => {
   const option = document.createElement("option") ;
   option.value = dep.id;
   option.textContent = dep.name;
   departmentSelect.appendChild(option);

 });
}

departmentSelect.addEventListener("change", async function(){
    departmentId = this.value;
    if(!departmentId){
        content.innerHTML= "<p>Seleccione un departamento para ver sus ciudades.</p>";
        return;

        
    }

    content.innerHTML= "<p>Cargando ciudades.....</p>";
    try{
        const res = await fetch(`${API_BASE}/Department/${departmentId}/cities`);
        const cities = await res.json();

        content.innerHTML = "<h2>Ciudades del departamento</h2>";
        if(cities.length === 0){
            content.innerHTML= "<p>No se encontro ninguna ciudad</p>";
        }else{
            cities.forEach(city =>{
                const div = document.createElement("div");
                div.className = "item";
                div.innerHTML = `<strong>${city.name}</strong>`;
                content.appendChild(div);
            });
        }
    } catch (error){
        content.innerHTML = "<p style='color = red'> Error al cargar ciudades.</p>"

    }
    
});

loadDepartments()

function showView(id) {
    document.querySelectorAll(".view").forEach(view => view.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
  
    if (id === "presidents") loadPresidents();
    else if (id === "regions") loadRegions();
    else if (id === "attractions") loadAttractions();
    else if (id === "country") loadCountry();
    else if (id === "airports") loadAirports();
  }


async function loadPresidents(){
    const container = document.getElementById("presidents");
  container.innerHTML = "<h2>Presidentes de Colombia</h2><p>Cargando...</p>";

    const res2 = await fetch(`${API_BASE}/President`);  
    const presidents = await res2.json();

    presidents.sort((a, b) => new Date(a.startPeriodDate) - new Date(b.startPeriodDate));
    container.innerHTML = `<h2>Presidentes</h2>` + presidents.map(p => `
    <div class="item">
      <strong>${p.name} ${p.lastName}</strong><br>
      Periodo: ${p.startPeriodDate} - ${p.endPeriodDate || "Actualidad"}<br>
      Partido: ${p.politicalParty}
    </div>
  `).join("");
}

async function loadAirports(){
  const container = document.getElementById("airportsContent");
container.innerHTML = "<h2>Aeropuertos de Colombia</h2><p>Cargando...</p>";

  const res2 = await fetch(`${API_BASE}/Airport`);  
  const airports = await res2.json();

  airports.sort((a, b) => new Date(a.startPeriodDate) - new Date(b.startPeriodDate));
  container.innerHTML = `<h2>Aeropuertos</h2>` + airports.map(p => `
  <div class="item">
    <strong>${p.name} </strong><br>
   
  </div>
`).join("");
}

async function searchAirport() {
  const query = document.getElementById("airportSearch").value.toLowerCase();
  const container = document.getElementById("airportsContent");

  container.innerHTML = "<p>Buscando aeropuerto...</p>";

  try {
    const res = await fetch(`${API_BASE}/Airport`);
    const airports = await res.json();

    const filtered = airports.filter(a => a.name.toLowerCase().includes(query));

    if (filtered.length === 0) {
      container.innerHTML = "<p>No se encontró ningún aeropuerto con ese nombre.</p>";
    } else {
      container.innerHTML = `<h2>Resultados de búsqueda</h2>` + filtered.map(p => `
        <div class="item">
          <strong>${p.name}</strong><br>
        </div>
      `).join("");
    }
  } catch (error) {
    container.innerHTML = "<p style='color: red'>Error al buscar aeropuerto.</p>";
  }
}

async function loadRegions() {
    const container = document.getElementById("regions");
    container.innerHTML = "<h2>Regiones</h2><p>Cargando...</p>";
    const res = await fetch(`${API_BASE}/Region`);
    const data = await res.json();
    container.innerHTML = `<h2>Regiones</h2>` + data.map(r => `
      <div class="item"><strong>${r.name}</strong></div>
    `).join("");
  }
  
  async function loadAttractions() {
    const container = document.getElementById("attractions");
    container.innerHTML = "<h2>Atracciones turísticas</h2><p>Cargando...</p>";
    const res = await fetch(`${API_BASE}/TouristicAttraction`);
    const data = await res.json();
    container.innerHTML = `<h2>Atracciones</h2>` + data.map(a => `
      <div class="item"><strong>${a.name}</strong><br>${a.city?.name || ""}</div>
    `).join("");
  }
  
  async function loadCountry() {
    const container = document.getElementById("country");
    container.innerHTML = "<h2>Información del País</h2><p>Cargando...</p>";
    const res = await fetch(`${API_BASE}/Country/Colombia`);
    const data = await res.json();
    container.innerHTML = `
      <div class="item">
        <strong>${data.name}</strong><br>
        Capital: ${data.capital}<br>
        Población: ${data.population}<br>
        Superficie: ${data.surface}<br>
        Independencia: ${data.independenceDate}
      </div>
    `;
  }
  
  

loadPresidents()
