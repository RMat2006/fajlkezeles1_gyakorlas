const getMethod = async (url)=>{
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("GET hiba: ", response.status)
        }
        return await response.json();
    }catch(error){
        throw new Error("GET hiba: ",error.message);
    }
}




document.addEventListener('DOMContentLoaded', async()=>{
    elsoFeladat();



    async function elsoFeladat(){
        try{
            const div = document.getElementById('div');
            const getResponse = await getMethod("/api/beolvas");
            const getResponseOsszeg = await getMethod("/api/osszeg")
            const p = document.getElementById("p");
            p.innerText = getResponse.content;
            const p2 = document.createElement('p')
            p2.innerText = "Összeg: "+ getResponseOsszeg.osszeg;
            const p3 = document.createElement('p');
            const getResponseSzorzat = await getMethod('/api/szorzat')
            p3.innerText = "Első és utolsó szorzata: "+getResponseSzorzat.szorzat;

            const p4 = document.createElement('p')
            const getResponseMin = await getMethod('/api/min')
            p4.innerHTML = "Legkisebb elem: "+getResponseMin.min;

            const p5 = document.createElement('p');
            const getResponseMax = await getMethod('/api/max')
            p5.innerText = "Legnagyobb elem: "+ getResponseMax.max;

            const getResponseSort = await getMethod('/api/rendezes')
            const p6 = document.createElement('p')
            p6.innerText = getResponseSort.sort;


            div.appendChild(p2);
            div.appendChild(p3);
            div.appendChild(p4);
            div.appendChild(p5);
            div.appendChild(p6)

        }catch(error){
            console.error("GET hiba van: ", error.message);
        }
    }
})