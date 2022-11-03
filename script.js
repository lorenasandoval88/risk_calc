let headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');

headers.append('GET','PUT','OPTIONS');



var movies = fetch("https://www.pgscatalog.org/rest/trait/EFO_0000305?format=json",{
          mode: 'no-cors',
          credentials: 'include',
method: 'GET',
headers: headers  //('https://ghibliapi.herokuapp.com/films')
})
    
  .then(response => {
    return response.json();
    })
  .then(json => {
    console.log(json)
    document.getElementById('root').innerHTML = json
    })
  .catch((e)=>{
   console.log("error!");
    })


