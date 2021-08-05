

var x = 1,	// So lan khai bao thoi gian dia diem
	y = 1;
	var url = "data/dvhc.js",
	dbDefined = false,
	userCodeSaved ='',
	dataStored,
	date,
	userForm,
	strHTML,
	userStored,
	formData,
	update = false;

const qrReader = new Html5Qrcode("qrReader",false);
var cameraId;
const qrReaderConfig = { fps: 50, qrbox: 250 };

Html5Qrcode.getCameras().then(devices => {
	if (devices && devices.length) {
	  cameraId = devices[1].id;
	  alert(cameraId);
	  return cameraId;
	}
  }).then(() => qrStartScan()).catch(err => { console.log(err)
  });

function qrStartScan(){
	document.getElementById('form-persion').style.visibility = 'hidden';
	qrReader.start(
		cameraId,	
		qrReaderConfig,
	  (decodedText, decodedResult) => {
		beep();
		document.getElementById('form-persion').style.visibility = 'visible';
		console.log(decodedText);
		qrReader.stop();
		qrReader.clear();
		dataAnalyst(decodedText);
	  },
	  (errorMessage) => {
		// parse error, ignore it.
	  }).catch((err) => {
	  // Start failed, handle it.
	});
	}
					
var dbPromise = idb.open('database', 4, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
      case 0:
		upgradeDb.createObjectStore('dvhcStore', {keyPath: 'MaDVHC'});
      case 1:
	   upgradeDb.createObjectStore('dataStore', {keyPath: 'dataIndex'});
      case 2:
        console.log('Creating a name index');
        var store = upgradeDb.transaction.objectStore('dvhcStore');
        store.createIndex('Ten', 'Ten', {unique:false});
		store.createIndex('Cap', 'Cap', {unique: false});
		store.createIndex('CapTren', 'CapTren', {unique: false});
      case 3:
        console.log('Version 3');
    }
	});

dbPromise.then(function(db){
		var tx = db.transaction('dvhcStore', 'readonly');
		var store = tx.objectStore('dvhcStore');
		return (store.get("01"));
	}).then(function (dataChecked){
		if(dataChecked == undefined)
		fetch(url)
		.then(response => response.json())
		.then(data => dataStored = data)
		.then(() => storeData())
		else ;//retrieveForm()

	})

dbPromise.then(function(db){
		var tx = db.transaction('dataStore', 'readonly');
		var store = tx.objectStore('dataStore');
		return (store.get("01"));
	}).then(function (dataChecked){
		if(dataChecked != undefined); //retrieveForm()
	})

  
function storeData(){
	dbPromise.then(function(db) {
      var tx = db.transaction('dvhcStore', 'readwrite');
      var store = tx.objectStore('dvhcStore');
	  var items = dataStored;
	  return Promise.all(items.map(function(item) {
			console.log('Adding item: ', item);
			return store.add(item);
		})).catch(function(e) {
		  		tx.abort();
		  		console.log(e);
		}).then(function() {
		  		console.log('All items added successfully!');
		});
	
	})
	}

function storeUser(){
		dbPromise.then(function(db) {
			var tx = db.transaction('userStore', 'readwrite');
			var store = tx.objectStore('userStore');
			var items = userStored;
			console.log(items)
			return Promise.all(items.map(function(item) {
				console.log('Adding item: ', item);
				return store.put(item);
			})).catch(function(e) {
					  tx.abort();
					  console.log(e);
			}).then(function() {
					  console.log('All items added successfully!');
			});
		})
	}

async function dataAnalyst(decodedText){
	var name = document.getElementById('persionName'),
		birthday = document.getElementById('birthday'),
		gender = document.getElementById('gender'),
		unit = document.getElementById('unit'),
		phoneNumber = document.getElementById('phoneNum'),
		idNumber = document.getElementById('idNum'),
		vacInject = document.getElementById('vacxInj'),
		symptoms = document.getElementById('symptoms'),
		arrDecoded = decodedText.split('%'),
		numPlace = parseInt(arrDecoded[1]),
		address = document.getElementById('address');
		console.log(arrDecoded);

	name.textContent = arrDecoded[2];
	birthday.textContent = arrDecoded[3];
	gender.textContent = (['Nam', 'Nữ', 'Khác'][['nam', 'nu', 'khac'].findIndex(x=>x===arrDecoded[4])]);
	unit.textContent = arrDecoded[5];
	phoneNumber.textContent = arrDecoded[6];
	idNumber.textContent = arrDecoded[7];
	address.textContent = arrDecoded[8].substr(10) + await capNhatDVHC(arrDecoded[8].substr(5,5), arrDecoded[8].substr(2,3), arrDecoded[8].substr(0,2));
	vacInject.textContent = arrDecoded[9];
	symptoms.textContent = (['Có', 'Không', 'Không xác định'][['co', 'khong', 'khac'].findIndex(x=>x===arrDecoded[10])])
	formPrepair();
	for(var i = 1; i <= numPlace; i++){
	formAddField(i);			
	document.getElementById('timeContact1'+(i)).textContent = arrDecoded[11 + 8*(i-1)];
	document.getElementById('dateContact1'+(i)).textContent = arrDecoded[12 + 8*(i-1)];
	document.getElementById('timeContact2'+(i)).textContent = arrDecoded[13 + 8*(i-1)];
	document.getElementById('dateContact2'+(i)).textContent = arrDecoded[14 + 8*(i-1)];
	document.getElementById('placeContact'+(i)).textContent = arrDecoded[18+ 8*(i-1)] + await capNhatDVHC(arrDecoded[15+ 8*(i-1)], arrDecoded[16+ 8*(i-1)], arrDecoded[17+ 8*(i-1)]);
	} //for
}

  function formAddField(x){
	  var html = '';
	  html += '<fieldset> <legend>Khu vực tiếp xúc: '+ x + '</legend> Từ: <div id="timeContact1'+ x + '" class="persionInfo"></div> giờ, ngày: <div id="dateContact1'+ x + '" class="persionInfo"></div><br>  Đến: <div id="timeContact2'+ x + '" class="persionInfo"></div> giờ, ngày: <div id="dateContact2'+ x + '" class="persionInfo"></div><br> Tại: <div id="placeContact'+ x + '" class="persionInfo"></div>  </fieldset>'
	  document.getElementById('contactInfo').insertAdjacentHTML("beforeend",html);
  }

  function formPrepair(){
	var html = '<div id="contactInfo"></div>';
	document.getElementById('form-persion').lastElementChild.remove();
	console.log(document.getElementById('form-persion'))
	document.getElementById('form-persion').lastElementChild.insertAdjacentHTML("afterend",html);
	console.log(document.getElementById('form-persion'))

  }

	async function capNhatDVHC(id1, id2, id3){
		var diaDiem = ', ', i = 0, id = [id3, id2, id1], arrData = [,,];
		await dbPromise.then(function(db) {
			var tx = db.transaction('dvhcStore', 'readonly');
			var store = tx.objectStore('dvhcStore');
			return store;})
		.then(function x(store){
			var data = store.get(id[i]);
			arrData[i] = data;
			i++;
			if(i<=2) return x(store);
			return arrData;	})
		.then(function (arrData){ 
			return Promise.all(arrData.map(function(item){
				return item;
			})).then(function (data){
				 diaDiem = diaDiem + (data[0].Ten +', '+ data[1].Ten + ', ' + data[2].Ten);
			})
			})
			return diaDiem;
			
	}

	function saveCode(){
		date = Date(),
		userForm = document.getElementById('userForm'),
		strHTML = userForm.outerHTML,
		userStored = [
			{
				dataIndex: "01",
				data: userCodeSaved,
				date: date
			},
			{
				dataIndex: "02",
				data: formData,
				date: date,
				numPlace: x
			}
		];

		storeUser();
	}

	function retrieveCode(){	
		dbPromise.then(function(db){
			var tx = db.transaction('userStore', 'readonly');
			var store = tx.objectStore('userStore');
			return store.get("01");}
			).then(function (data){
				var x = data.data;
				qrcode.makeCode(x);
				var qrcodeView = document.getElementById("qrcodeView");
				var formView = document.getElementById("declareForm");
				var qrdescript = document.getElementById("qrdescript");
				var titleDeclare = document.getElementById("title-declare");
				formView.style.display = "none"
				qrcodeView.style.display = "block";
				titleDeclare.style.display = "none";
				qrdescript.style.display  = "block";
			})		
	}

	async function retrieveForm(){	
		dbPromise.then(function(db){
			var tx = db.transaction('dataStore', 'readonly');
			var store = tx.objectStore('dataStore');
			return store.get("01");}
			).then(function (data){
				var x = data.data;
				document.getElementById("user").value = x[1];
				document.getElementById("birthday").value = x[2];
				switch(x[3]){
					case "nam":
						document.getElementById('male').checked = true;
						break;
					case "nu":
						document.getElementById('female').checked = true;
						break;
					case "khac":
						document.getElementById('otherSex').checked = true;
						break;
				}
				document.getElementById("unit_").value = x[4];
				document.getElementById("phoneNumber").value = x[5];

				switch(x[6]){
					case "chua":
						document.getElementById('vacInjectNo').checked = true;
						break;
					case "roi":
						document.getElementById('vacInjectYes').checked = true;
						break;
					default:
						break;
				}
				document.getElementById("vactypeInput").value = x[7];

				switch(x[8]){
					case "khong":
						document.getElementById('symptomsNo').checked = true;
						break;
					case "co":
						document.getElementById('symptomsYes').checked = true;
						break;
				}

				for(var i = 0; i < data.numPlace; i++){
					if(i>0) addFieldFunction();
					document.getElementById("timeContact1"+(i+1)).value = x[9+8*(i)];
					document.getElementById("dateContact1"+(i+1)).value = x[10+8*(i)];
					document.getElementById("timeContact2"+(i+1)).value = x[11+8*(i)];
					document.getElementById("dateContact2"+(i+1)).value = x[12+8*(i)];
					
					document.getElementById("noiDenTinhId"+ (i+1)).value = x[13+8*(i)];
					capNhatDVHC("noiDenTinhId"+(i+1), "noiDenHuyenId"+ (i+1));
				} //for
				return data;				
				
			}).then(sleeper(500)).then(function(data){
				var x = data.data;
				for(var i = 0; i < data.numPlace; i++){
				document.getElementById("noiDenHuyenId"+ (i+1)).value = x[14+8*(i)];
				console.log(document.getElementById("noiDenHuyenId"+ (i+1)).value)
				capNhatDVHC("noiDenHuyenId"+(i+1), "noiDenXaId"+ (i+1));
				} // for	
				return data;

			}).then(sleeper(500)).then(function(data){
				var x = data.data;
				for(var i = 0; i < data.numPlace; i++){
					document.getElementById("noiDenXaId"+ (i+1)).value = x[15+8*(i)];
					document.getElementById("persionContact"+ (i+1)).value = x[16+8*(i)];
				}

			}) //then
	}


	function sleeper(ms){return function(x){return new Promise(resolve => setTimeout(() => resolve(x), ms));}; }
	audioCtx = new(window.AudioContext || window.webkitAudioContext)();function beep(){var oscillator=audioCtx.createOscillator();var gainNode=audioCtx.createGain();oscillator.connect(gainNode);gainNode.connect(audioCtx.destination);gainNode.gain.value = 0.2;oscillator.frequency.value = 1332; oscillator.type='sine'; oscillator.start();setTimeout(function() {oscillator.stop(); },30)};
