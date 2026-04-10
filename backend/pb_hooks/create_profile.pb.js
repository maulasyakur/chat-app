onRecordCreate((e) => {
  e.next();

  if (!e.record) return;
  if (e.record.collection().name !== "users") return;

  try {
    // set emailVisibility to false
    e.record.set("emailVisibility", false);
    $app.save(e.record);
  } catch (err) {
    console.error("Failed to run onRecordCreate hook:", err);
  }
});
