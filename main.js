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
        item.uid = childSnapshot.key();
        this.push('items', item);
      }.bind(this));
        setTimeout(scrollToBottom, 0);
        function scrollToBottom(){
            document.getElementById('mainContainer').scrollTop = 99999999999999999999999999999999999;
        }      
    };


    app.addItem = function(event) {
      event.preventDefault(); // Don't send the form!
      this.ref.push({
        text: app.newItemValue,
        img: profilePic,
        username: profileName
      });
      app.newItemValue = '';
    };

    app.toggleItem = function(event) {
      this.ref.
        child(event.model.item.uid).
        update({done: event.model.item.done});
    };

    app.deleteItem = function(event) {
      this.ref.child(event.model.item.uid).remove();
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