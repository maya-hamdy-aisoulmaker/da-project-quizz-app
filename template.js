export function getTemplate() {
  return `
    <div class="card shadow-lg quiz-card w-100 mx-auto">
      <div class="card-body text-center">

        <video 
          class="quiz-robot mb-1"
          controls 
          controlsList="nodownload noplaybackrate disablepictureinpicture" 
          disablePictureInPicture>
          <source src="img/Gen-3 Alpha Turbo 3114889655, both robots are chat, Cropped - 0_3-2webp.mp4" type="video/mp4">
          Dein Browser unterstützt das Video-Tag nicht.
        </video>

        <div id="quizView">
          <div class="progress mb-3">
            <div id="progressBar" 
                 class="progress-bar bg-success" 
                 role="progressbar" 
                 style="width: 0%;" 
                 aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
              0 / 0
            </div>
          </div>

          <h5 id="questionText" class="card-title mb-4"></h5>
          <div id="answers" class="list-group mb-4"></div>

          <div class="d-grid">
            <button id="nextButton" class="btn btn-primary">Nächste Frage</button>
          </div>
        </div>

        <div id="resultView" class="d-none">
          <div id="resultAlert" class="alert alert-info"></div>
          <div class="d-grid mt-3">
            <button id="restartBtn" class="btn btn-primary">🔄 Nochmal spielen</button>
          </div>
        </div>

      </div>
    </div>
  `;
}