function getData() {
    document.getElementById("getterLoading").style.display = "block";
    let userAddress = document.getElementById("userAddress").value;

    fetch(`/api/user-data/${userAddress}`)
    .then(response => response.json())
    .then(res => {
        document.getElementById("getterLoading").style.display = "none";
        if(res.status === 200){
            if(res.data["4"]){
                let detailBox = document.getElementById("user-details");
                document.getElementById("consumed-energy-unit").innerHTML = res.data["0"];
                document.getElementById("produced-energy-unit").innerHTML = res.data["1"];
                document.getElementById("debt").innerHTML = res.data["2"];
                switch(res.data["3"]){
                    case "0":
                        document.getElementById("energy-consumption-status").innerHTML = "OVER CONSUMED";
                        break;
                    case "1":
                        document.getElementById("energy-consumption-status").innerHTML = "OVER PRODUCED";
                        break;
                    case "2":
                        document.getElementById("energy-consumption-status").innerHTML = "EQUAL";
                        break;
                    default:
                        console.log("ERROR");
                }
                detailBox.style.display = "block";
                document.getElementById("chartContainer").style.display = "block";
                let energyConsumed = parseInt(res.data["0"]),
                    energyProduced = parseInt(res.data["1"]),
                    totalConsumption = energyConsumed + energyProduced;
                var chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,
                    title: {
                        text: 'Energy Data'
                    },
                    data: [{
                        type: "pie",
                        startAngle: 240,
                        // yValueFormatString: "##0.00\"%\"",
                        indexLabel: "{label} {y}",
                        dataPoints: [
                            {y: (energyConsumed/totalConsumption)*100, label: "Consumed Energy", yValueFormatString: "##0.00\"%\""},
                            {y: (energyProduced/totalConsumption)*100, label: "Produced Energy", yValueFormatString: "##0.00\"%\""},
                            {y: res.data["2"], label: "Sellable Units", yValueFormatString: "##0.00\" units\""}
                        ]
                    }]
                });
                chart.render();
            }
            else{
                document.getElementById("notification").innerHTML = '<div class="error notification__box">ERROR!! NO SUCH USER FOUND</div>';
            }
        }
        else {
            document.getElementById("notification").innerHTML = `<div class="error notification__box">ERROR!! ${res.message}</div>`;
        }
    }).catch(err => console.err)
}

function postData() {
    document.getElementById("loading").style.display = "block";
    let userAddress = document.getElementById("address").value,
        energyConsumed = parseInt(document.getElementById("energy_consumed").value),
        energyProduced = parseInt(document.getElementById("energy_produced").value);   
    
    const payload = {
        userAddress,
        energyConsumed,
        energyProduced
    }
    fetch("/api/user-data", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(res => {
        document.getElementById("loading").style.display = "none";
        if(res.status === 200) {
            document.getElementById("notification").innerHTML = `<div class="success notification__box">SUCCESS!! Transaction Hash is: ${res.data}</div>`;
        }else{
            document.getElementById("notification").innerHTML = `<div class="error notification__box">ERROR!! ${res.message}</div>`;
        }
    }) 
}

function settleUserDebt() {
    document.getElementById("settleLoading").style.display = "block";

    let settlementUserAddress = document.getElementById("settlementUserAddress").value;
    const payload = {
        userAddress: settlementUserAddress
    }
    fetch("/api/settle-debt", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(res => {
        document.getElementById("settleLoading").style.display = "none";
        if(res.status === 200) {
            document.getElementById("notification").innerHTML = `<div class="success notification__box">SUCCESS!! Transaction Hash is: ${res.data}</div>`;
        }else{
            document.getElementById("notification").innerHTML = `<div class="error notification__box">ERROR!! ${res.message}</div>`;
        }
    }) 
}

function getPowerAdminDue() {
    document.getElementById("dueLoading").style.display = "block";
     fetch(`/api/power-admin-due`)
    .then(response => response.json())
    .then(res => {
        document.getElementById("dueLoading").style.display = "none";
        if(res.status === 200){
            let dueBox = document.getElementById("showPowerAdminDue");
            document.getElementById("powerAdminDue").innerHTML = res.data;

            dueBox.style.display = "block";
        }
        else {
            document.getElementById("notification").innerHTML = `<div class="error notification__box">ERROR!! ${res.message}</div>`;
        }
    }).catch(err => console.err)
}