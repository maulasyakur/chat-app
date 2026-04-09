onRecordCreate((e) => {
  e.next();

  if (e.collection.name !== "users") return;
  if (!e.record) return; // guard against undefined

  const profilesCollection = $app.findCollectionByNameOrId("profiles");
  const profile = new Record(profilesCollection);
  profile.set("user", e.record.id);
  profile.set("name", e.record.get("name") || "");
  profile.set("avatar", e.record.get("avatar") || "");
  $app.save(profile);
});
