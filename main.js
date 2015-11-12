(function(document) {
'use strict';

	var app = document.querySelector('#app');
	var profilePic = "http://usn.com.np/wp-content/uploads/2014/07/dummy-avatar.png";
	var profileName = "Anonymous";

	app.items = [];
	app.firebaseURL = 'https://chat-with-me-2183.firebaseio.com';
	app.firebaseProvider = 'google';

	app.updateItems = function(snapshot) {
		this.items = [];
		snapshot.forEach(function(childSnapshot) {
			var item = childSnapshot.val();
			var UTCTime = new Date(item.time);
			item.time = UTCTime.getHours() + ":" + (UTCTime.getMinutes() < 10?'0':'') + UTCTime.getMinutes();
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June","July", "Aug", "Sept", "Oct", "Nov", "Dec"];
			item.date = UTCTime.getUTCDate() + " " + monthNames[UTCTime.getUTCMonth()] + " " + UTCTime.getUTCFullYear();
			this.push('items', item);
		}.bind(this));
		setTimeout(scrollToBottom, 0);
		function scrollToBottom(){
			document.getElementById('mainContainer').scrollTop = 999999999999999999999999;
		}      
	};

	app.addItem = function(event) {
		event.preventDefault(); // Don't send the form!
		if (app.newItemValue.length > 0){
			var currentTime = (new Date()).getTime();
			this.ref.push({
				text: app.newItemValue,
				img: profilePic,
				username: profileName,
				time: currentTime
			});
			app.newItemValue = '';        
		}
	};

	app.onFirebaseError = function(event) {
		this.$.errorToast.text = event.detail.message;
		this.$.errorToast.show();
	};

	app.onFirebaseLogin = function(e) {
		profilePic = e.detail.user.google.profileImageURL;
		profileName = e.detail.user.google.displayName;
		this.ref = new Firebase(this.firebaseURL);
		this.ref.on('value', function(snapshot) {
			app.updateItems(snapshot);
		});
	};

})(document);