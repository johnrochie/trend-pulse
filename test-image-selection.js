const photos = [
  '1551288049-bebda4e38f71', // 0
  '1460925895917-afdab827c52f', // 1 - graph
  '1550745165-9bc0b252726f', // 2
  '1499951360447-b19be8fe80f5', // 3
  '1444653614773-995cb1ef9efa', // 4
  '1556761175-b413da4baf72', // 5
  '1551434678-e076c223a692', // 6
  '1552664730-d307ca884978', // 7
];

console.log("Photo indices for article IDs:");
[21, 10, 8].forEach(id => {
  const index = id % photos.length;
  console.log(`ID ${id} → index ${index} → photo ${photos[index]}`);
});
