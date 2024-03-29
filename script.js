

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'ec5a2fc585mshecbbe0f4f30fba1p14d9a5jsn300fdde29825',
		'X-RapidAPI-Host': 'ip-reputation-geoip-and-detect-vpn.p.rapidapi.com'
	}
};

const fetchIpReputation = ip => {
  return fetch(`https://ip-reputation-geoip-and-detect-vpn.p.rapidapi.com/?ip=${ip}`, options)
  .then(res => res.json())
  .catch(err => console.error(err))
}

const $ = selector => document.querySelector(selector)

const $form = $("#form")
const $input = $("#input")
const $submit = $("#submit")
const $results = $("#results")

$form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const {value} = $input
  if (!value) return

  $submit.setAttribute('disabled', '')
  $submit.setAttribute('aria-busy', 'true')

  const ipInfo = await fetchIpReputation(value)

  if (ipInfo) {
    $results.innerHTML = `
      <h1 class="text-center">IP Relevant Information</h1>
      <div class="grid">
        <div>
          <img id="flag" class="flag mx-auto d-block" src="${ipInfo.flag_image}" alt="Country Flag">
        </div>
        <div class="info">
          <p><strong>Risk Level:</strong> <span id="riskLevel">${ipInfo.risk_level}</span></p>
          <p><strong>Location:</strong> <span id="location">${ipInfo.city + ', ' + ipInfo.country + ', ' + ipInfo.continent}</span></p>
          <p><strong>Organization:</strong> <span id="organization">${ipInfo.organization}</span></p>
          <p><strong>Time Zone:</strong> <span id="timeZone">${ipInfo.time_zone}</span></p>
          <p><strong>Currency:</strong> <span id="currency">${ipInfo.currency}</span></p>
          <p><strong>Languages:</strong> <span id="languages">${ipInfo.languages[0].name}</span></p>
        </div>
      </div>
      </br>
      <article>
      <header>Message:</header>
      ${ipInfo.message}
      </article>
      <div class='grid'>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-tooltip="Indicates whether the IP belongs to a data center">Is Datacenter</td>
              <td>${ipInfo.is_datacenter?"✔":''}</td>
            </tr>
            <tr>
              <td data-tooltip="Indicates whether the IP belongs to an Internet Service Provider">Is ISP</td>
              <td>${ipInfo.is_isp?"✔":''}</td>
            </tr>
            <tr>
              <td data-tooltip="Indicates whether the IP belongs to an educational institution">Is Educational</td>
              <td>${ipInfo.is_educational?"✔":''}</td>
            </tr>
            <tr>
              <td data-tooltip="Indicates whether the IP belongs to a military organization">Is Military</td>
              <td>${ipInfo.is_military?"✔":''}</td>
            </tr>
            <tr>
              <td data-tooltip="Indicates whether the IP belongs to a government entity">Is Government</td>
              <td>${ipInfo.is_government?"✔":''}</td>
            </tr>
            <tr>
              <td data-tooltip="Indicates whether the IP belongs to a business or commercial entity">Is Business</td>
              <td>${ipInfo.is_business?"✔":''}</td>
            </tr>
            <tr>
              <td data-tooltip="Indicates whether the IP is associated with a VPN or proxy service">Is VPN/Proxy</td>
              <td>${ipInfo.is_vpn_proxy?"✔":''}</td>
            </tr>
            <tr>
              <td data-tooltip="Indicates whether the IP is associated with the Tor network">Is Tor</td>
              <td>${ipInfo.is_tor?"✔":''}</td>
            </tr>
            <tr>
              <td data-tooltip="Indicates whether the IP is flagged as malicious">Is Malicious</td>
              <td>${ipInfo.is_malicious?"✔":''}</td>
            </tr>
            <tr>
              <td data-tooltip="Indicates whether the IP is associated with abusive behavior">Is Abusive</td>
              <td>${ipInfo.is_abusive?"✔":''}</td>
            </tr>
            <tr>
              <td data-tooltip="Indicates whether the IP is in a reserved or bogon range">Is Bogon</td>
              <td>${ipInfo.is_bogon?"✔":''}</td>
            </tr>
          </tbody>
        </table>
        <div id="map"></div>
      </div>
      </br>
      <details>
        <summary role="button">Full response</summary>
        <p><pre>${JSON.stringify(ipInfo, null, 2)}</pre></p>
      </details>      
    `
  }

  let map;

  async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
      center: { lat: ipInfo.latitude, lng: ipInfo.longitude },
      zoom: 8,
    });

    const marker = new google.maps.Marker({
      position: { lat: ipInfo.latitude, lng: ipInfo.longitude },
      map: map,
    });
  }

  initMap();

  $submit.removeAttribute('disabled')
  $submit.removeAttribute('aria-busy')
})