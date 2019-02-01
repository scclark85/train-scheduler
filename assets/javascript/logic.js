// Initialize Firebase
var config = {
    apiKey: "AIzaSyDAImC4SsEMsls2iAOQB0aYzZdDR0HSX6A",
    authDomain: "sup-people.firebaseapp.com",
    databaseURL: "https://sup-people.firebaseio.com",
    projectId: "sup-people",
    storageBucket: "sup-people.appspot.com",
    messagingSenderId: "200011654073"
};

firebase.initializeApp(config);

var database = firebase.database();

// Button for adding trains
$("#submit").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name").val().trim();
    var trainDest = $("#dest").val().trim();
    var trainTime = moment($("#time").val().trim(), "HH:mm").format("x");
    var trainFreq = $("#freq").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDest,
        time: trainTime,
        frequency: trainFreq,
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.desination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#dest").val("");
    $("#time").val("");
    $("#freq").val("");
});

//Creates Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    trainTime = moment.unix(trainTime).format("HH:mm");

    var trainFreq = childSnapshot.val().frequency;

    // Employee Info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainTime);
    console.log(trainFreq);

    var time = calculateTimes(trainFreq, trainTime);

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(time.nextTrain),
        $("<td>").text(time.minutesTillTrain),
    );

    // Append the new row to the table
    $("#table-div > tbody").append(newRow);
});

function calculateTimes(frequency, startTime) {
    var tFrequency = frequency;

    //Time is 3:30am
    var firstTime = startTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");

    // return [tMinutesTillTrain, nextTrain];
    return {
        minutesTillTrain: tMinutesTillTrain,
        nextTrain: nextTrain
    }
}