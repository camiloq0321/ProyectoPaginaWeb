// Event listener para el formulario de cuentos
document.getElementById('storyForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const nombres = document.getElementById('nombres').value;
    const apodo = document.getElementById('apodo').value;
    const colorCabello = document.getElementById('colorCabello').value;
    const colorOjos = document.getElementById('colorOjos').value;
    const edad = document.getElementById('edad').value;
    const hobby = document.getElementById('hobby').value;
    
    // Validar que solo se ingrese un hobby
    if (hobby.includes(',') || hobby.includes(';') || hobby.includes('y')) {
        alert('⚠️ Advertencia: Por favor ingresa solo UN hobby. No uses comas, punto y coma o la palabra "y" para separar múltiples hobbies.');
        return;
    }
    
    // Generar y mostrar el cuento
    const cuento = generarCuento(nombres, apodo, colorCabello, colorOjos, edad, hobby);
    document.getElementById('storyText').innerHTML = cuento;
    document.getElementById('storySection').classList.add('show');
    
    // Hacer scroll hacia el cuento
    document.getElementById('storySection').scrollIntoView({ behavior: 'smooth' });
});

// Función para generar cuentos personalizados
function generarCuento(nombres, apodo, colorCabello, colorOjos, edad, hobby) {
    const cuentos = [
        `Érase una vez, en un lugar mágico, vivía <strong>${nombres}</strong>, a quien todos conocían cariñosamente como <strong>${apodo}</strong>. Con su hermoso cabello <strong>${colorCabello}</strong> que brillaba bajo el sol y sus ojos <strong>${colorOjos}</strong> que parecían contener estrellas, <strong>${apodo}</strong> tenía <strong>${edad}</strong> años de edad y una pasión que lo definía: <strong>${hobby}</strong>.<br><br>
        
        Cada día, <strong>${apodo}</strong> dedicaba horas a perfeccionar su arte en <strong>${hobby}</strong>. Sus amigos siempre decían que cuando practicaba, el mundo parecía detenerse para admirar su dedicación. El cabello <strong>${colorCabello}</strong> de <strong>${apodo}</strong> bailaba con el viento mientras se concentraba en su actividad favorita, y sus ojos <strong>${colorOjos}</strong> brillaban con una intensidad que iluminaba todo a su alrededor.<br><br>
        
        Con el tiempo, <strong>${apodo}</strong> se convirtió en un maestro de <strong>${hobby}</strong>, inspirando a otros a seguir sus sueños. Su historia nos recuerda que la pasión y la dedicación pueden transformar cualquier hobby en algo extraordinario. Y así, <strong>${nombres}</strong>, conocido como <strong>${apodo}</strong>, vivió felizmente dedicándose a lo que más amaba: <strong>${hobby}</strong>.`,
        
        `En un bosque encantado, habitaba una persona muy especial llamada <strong>${nombres}</strong>. Sus amigos la conocían como <strong>${apodo}</strong>, y era famosa por su extraordinario cabello <strong>${colorCabello}</strong> que parecía tener vida propia. Sus ojos <strong>${colorOjos}</strong> reflejaban la sabiduría de sus <strong>${edad}</strong> años de experiencia.<br><br>
        
        <strong>${apodo}</strong> tenía un don único: su pasión por <strong>${hobby}</strong>. Cada mañana, antes de que el sol saliera, ya estaba practicando y perfeccionando sus habilidades. El bosque entero se llenaba de música cuando <strong>${apodo}</strong> se dedicaba a <strong>${hobby}</strong>, y los animales se acercaban para observar con asombro.<br><br>
        
        Con el tiempo, <strong>${apodo}</strong> se convirtió en una leyenda en el bosque. Su cabello <strong>${colorCabello}</strong> brillaba como nunca antes, y sus ojos <strong>${colorOjos}</strong> contenían la magia de miles de historias. La historia de <strong>${nombres}</strong>, el gran maestro de <strong>${hobby}</strong>, se contaba de generación en generación.`,
        
        `Hace mucho tiempo, en una ciudad llena de sueños, vivía <strong>${nombres}</strong>. Todos la llamaban <strong>${apodo}</strong>, y su presencia iluminaba cualquier lugar donde estuviera. Su cabello <strong>${colorCabello}</strong> era su sello distintivo, y sus ojos <strong>${colorOjos}</strong> contenían la profundidad de sus <strong>${edad}</strong> años de vida.<br><br>
        
        <strong>${apodo}</strong> tenía un secreto: su amor incondicional por <strong>${hobby}</strong>. Cada tarde, después de sus responsabilidades, se sumergía completamente en su pasión. El tiempo parecía detenerse cuando <strong>${apodo}</strong> se dedicaba a <strong>${hobby}</strong>, y su cabello <strong>${colorCabello}</strong> brillaba con una luz especial.<br><br>
        
        Con dedicación y perseverancia, <strong>${apodo}</strong> transformó su hobby en algo extraordinario. Sus ojos <strong>${colorOjos}</strong> brillaban con orgullo cada vez que alguien admiraba su trabajo. La historia de <strong>${nombres}</strong>, conocida como <strong>${apodo}</strong>, se convirtió en un ejemplo de cómo seguir los sueños puede llevar a una vida llena de felicidad y realización personal.`
    ];
    
    // Seleccionar un cuento aleatorio
    const cuentoAleatorio = cuentos[Math.floor(Math.random() * cuentos.length)];
    return cuentoAleatorio;
}

// Función para resetear el formulario
function resetForm() {
    // Limpiar el formulario
    document.getElementById('storyForm')?.reset();
    
    // Ocultar la sección del cuento
    document.getElementById('storySection')?.classList.remove('show');
    
    // Hacer scroll hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event listener para validación en tiempo real del campo hobby
document.getElementById('hobby')?.addEventListener('input', function() {
    const hobbyValue = this.value;
    const warningDiv = document.getElementById('hobbyWarning');
    
    // Crear o actualizar el mensaje de advertencia
    if (hobbyValue.includes(',') || hobbyValue.includes(';') || hobbyValue.includes('y')) {
        if (!warningDiv) {
            const warning = document.createElement('div');
            warning.id = 'hobbyWarning';
            warning.style.color = '#ff6b6b';
            warning.style.fontSize = '14px';
            warning.style.marginTop = '5px';
            warning.innerHTML = '⚠️ Solo ingresa UN hobby, no múltiples';
            this.parentNode.appendChild(warning);
        }
    } else {
        if (warningDiv) {
            warningDiv.remove();
        }
    }
});


