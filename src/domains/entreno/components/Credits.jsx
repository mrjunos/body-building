/**
 * La atribución a Gym visual es obligación de licencia: las animaciones se
 * enlazan con permiso del repositorio original, no se redistribuyen.
 */
export function Credits() {
  return (
    <p
      style={{
        margin: '22px 0 0',
        fontSize: 11.5,
        color: 'var(--muted)',
        textAlign: 'center',
        lineHeight: 1.6,
      }}
    >
      Selección de ejercicios según Neco y Andoni — <em>El mejor ejercicio para cada músculo</em>.
      <br />
      Fotografías: <a href="https://github.com/yuhonas/free-exercise-db">free-exercise-db</a>, licencia
      Unlicense.
      <br />
      Animaciones © <a href="https://gymvisual.com/">Gym visual</a>, enlazadas desde{' '}
      <a href="https://github.com/hasaneyldrm/exercises-dataset">exercises-dataset</a>.
    </p>
  );
}
