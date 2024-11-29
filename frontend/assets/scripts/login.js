const params = new URLSearchParams(decodeURIComponent(document.location.search))

if(params.get('client') == null){
}
else{
  sessionStorage.setItem('DatabaseName',params.get('client'));
  let system = params.get('client').split('_');
system.shift();
let systemName = '';
systemName = system.map((item) => systemName = systemName + ' ' + item)
document.getElementById('LoginFormTitle').innerHTML =`LOGIN TO SYSTEM -${systemName[systemName.length - 1]}`
}

function createURL(htmlFileName) {
  window.location = createDynamicURL(htmlFileName);
}

function createDynamicURL(htmlFileName) {
  let htmlPageURL = encodeURIComponent(`client=${sessionStorage.getItem('DatabaseName')}`)
  var URL = `${htmlFileName}?${htmlPageURL}`
  return URL;
}

function submitLogin(){
    $.ajax({
        type: 'GET',
        url: loginUrl + `db_name=${params.get('client')}&collection_name=users&userID=${document.getElementById('userID').value}&pwd=${document.getElementById('userPassword').value}`,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
           let client = params.get('client')
           setLocalStorageWithExpiry(client, 3600000)
           if(params.get('page')==null || params.get('page')==undefined ){
            window.location.href = `dashboard.html${window.location.search}`
           }
           else{
             let urlParameters = encodeURIComponent(`client=${client}`)
            window.location.href = `${params.get('page')}?${urlParameters}`
           }
           
           
        
        },
        error: function(err){
          document.getElementById('errorMessage').style.display = 'block';
        }
    })
}

function setLocalStorageWithExpiry(key, ttl) {
	const now = new Date()

	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const item = {
		isAuth: true,
		expiry: now.getTime() + ttl,
	}
	localStorage.setItem(key, JSON.stringify(item))
}
