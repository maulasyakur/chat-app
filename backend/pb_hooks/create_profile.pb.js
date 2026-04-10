onRecordCreate((e) => {
  e.next();

  if (!e.record) return;
  if (e.record.collection().name !== "users") return;

  try {
    // set emailVisibility to false
    e.record.set("emailVisibility", false);
    $app.save(e.record);

    // create profile
    const profilesCollection = $app.findCollectionByNameOrId("profiles");
    const profile = new Record(profilesCollection);
    profile.set("user", e.record.id);
    profile.set("name", e.record.getString("name") || "");
    profile.set("avatar", e.record.getString("avatar") || "");
    $app.save(profile);
  } catch (err) {
    console.error("Failed to run onRecordCreate hook:", err);
  }
});
