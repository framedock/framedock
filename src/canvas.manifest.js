export const manifest = {
  screens: {
    scr_6s68u6: { name: "Home", route: "/", position: { "x": 160, "y": 220 } },
    scr_pgaqep: { name: "Dashboard", route: "/dashboard", position: { "x": 1560, "y": 220 } }
  },
  sections: {
    sec_8zfalu: { name: "Main Pages", x: 0, y: 0, width: 2920, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_8zfalu", children: [
    { kind: "screen", id: "scr_6s68u6" },
    { kind: "screen", id: "scr_pgaqep" }]
  }]

};