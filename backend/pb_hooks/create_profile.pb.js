onRecordCreate((e) => {
  e.next();

  if (!e.record) return;
  if (collectionName !== "users") return;

  try {
    const profilesCollection = $app.findCollectionByNameOrId("profiles");
    const profile = new Record(profilesCollection);
    profile.set("user", e.record.id);
    profile.set("name", e.record.getString("name") || "");
    profile.set("avatar", e.record.getString("avatar") || "");
    $app.save(profile);
  } catch (err) {
    console.error("Failed to create profile:", err);
  }
});
