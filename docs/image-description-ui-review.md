# Image describer UI review notes

The new route follows the existing folio playground language: dark grid background, compact top navigation, darkslate utility cards, rounded borders, small labels, and the primary accent button.

The desktop capture at 1440x1000 shows a balanced two-column layout with Source image on the left and Description on the right. The mobile capture at 390x844 collapses the two columns into a vertical flow without horizontal overflow; the upload target remains large enough to use by touch and the result section follows naturally below it.

The existing global loader/search transition leaves blue blocks visible in the captured screenshots near the top navigation. This is unrelated to the new playground component because the same transition appears on the baseline `/playground` capture. It should not be treated as a feature regression.

The visible states verified are the empty upload state, disabled Analyze button, optional instruction field, and empty result state. A live model response still requires `ORCAROUTER_API_KEY` in the deployment environment.
