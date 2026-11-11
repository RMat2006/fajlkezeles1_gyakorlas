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
            const getResponse = await getMethod("/api/readfile");
            const h1 = document.getElementById("h1");
            h1.innerText = getResponse.text;
        }catch(error){
            console.error("GET hiba van: ", error.message);
        }
    }
})