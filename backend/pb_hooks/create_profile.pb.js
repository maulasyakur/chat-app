onRecordCreate((e) => {
  e.next();

  if (!e.record) return;
  if (e.record.collection().name !== "users") return;

  try {
    const profilesCollection = $app.findCollectionByNameOrId("profiles");
    const profile = new Record(profilesCollection);

    console.log("user id:", e.record.id);
    console.log("name:", e.record.getString("name"));

    profile.set("user", e.record.id);
    profile.set("name", e.record.getString("name") || "");
    profile.set("avatar", e.record.getString("avatar") || "");
    $app.save(profile);
  } catch (err) {
    console.error("Failed to create profile:", err);
  }
});
