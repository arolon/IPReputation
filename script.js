

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
    $results.innerHTML = JSON.stringify(ipInfo, null, 2)
  }

  $submit.removeAttribute('disabled')
  $submit.removeAttribute('aria-busy')
})