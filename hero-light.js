// Lumière champagne de l'accueil, sur ordinateur et tablette uniquement : rien n'est chargé sur téléphone.
// Très sombre et très lente, décorative. Sans WebGL ou en économie de données, l'accueil reste sur le noir simple.
const host = document.getElementById('heroLight');
const wide = window.matchMedia('(min-width: 681px)').matches;
const saveData = navigator.connection && navigator.connection.saveData;

if (host && wide && !saveData) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const colors = ['#07080a', '#07080a', '#100e0a', '#221b0e'];
  try {
    const [{ ShaderMount }, { meshGradientFragmentShader }, { getShaderColorFromString }] = await Promise.all([
      import('./vendor/paper-shaders-0.0.81/shader-mount.js'),
      import('./vendor/paper-shaders-0.0.81/shaders/mesh-gradient.js'),
      import('./vendor/paper-shaders-0.0.81/get-shader-color-from-string.js'),
    ]);
    new ShaderMount(host, meshGradientFragmentShader, {
      u_colors: colors.map(getShaderColorFromString), u_colorsCount: colors.length,
      u_distortion: 0.9, u_swirl: 0.2, u_grainMixer: 0, u_grainOverlay: 0.04,
      u_fit: 0, u_scale: 1, u_rotation: 0, u_offsetX: 0, u_offsetY: 0, u_originX: 0.5, u_originY: 0.5, u_worldWidth: 0, u_worldHeight: 0
    }, undefined, still ? 0 : 0.12, 40, 1, 1280 * 720);
  } catch (e) {
    host.hidden = true;
  }
}
