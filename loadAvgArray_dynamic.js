
const measureEnum = {
  AVGSYS : 0,
  AVGDIA : 1,
  AVGBMI : 2,
  AVGCREAT : 3,
  AVGCHOL : 4
};

let avgLabs = {};

function loadAvgArray() {
  return fetch('avgLabs.json')
    .then(response => response.json())
    .then(data => {
      avgLabs = data;
      console.log("Lab averages loaded", avgLabs);
    })
    .catch(error => {
      console.error("Failed to load average lab values:", error);
    });
}
