# Comment Styles

Please adhere to the CSS comment styles below to aid in the consistency and usability of this styleguide. This becomes increasingly important as more developers work on and touch the files this project.

	/**
	 * This is a file heading comment. Use this file heading comment style unless
	 * the partial contains only one section, then use the partial file heading
	 * comment style.
	 *
	 * This comment style should at least include:
	 *
	 * 1) An overview of the file's role.
	 * 2) A mini list of sections included in the file.
	 *
	 * Anything else that may be useful in using the contents of the file
	 * or guiding a future developer on what to include in the file.
	 *
	 * Two blank lines should follow this comment style.
	 */


	/* ==========================================================================
	   This is a section heading comment.
	   Two blank lines should follow this comment style.
	   ========================================================================== */


	/* ==========================================================================
	   This is a partial file heading comment.
	   Two blank lines should follow this comment style.
	   ========================================================================== */


	/* This is a sub-section heading comment.
	   One blank line should follow this comment style, unless it is directly
	   follow by a usage heading comment.
	   ========================================================================== */
	/*
	 * This is a usage heading comment. It should include usage guidelines for
	 * whatever is being defined following the comment (i.e., mixins, extendables,
	 * variables, etc.). Example:
	 *
	 * Usage:
	 * @include image-2x('logo2x.png', 100px, 25px);
	 *
	 * Note:
	 * Retina images should follow naming convention of 'image@2x.png'
	 *
	 * One blank line should follow this comment style.
	 */

	 // This is an inline comment that can be up to a few lines long.
	 // This type of comment will not show in the compiled CSS.

	 //////////////////////
     // THIS TYPE OF COMMENT
     $my_var = "My Variable";
     // WRAPS WHAT IT DESCRIBES
     //////////////////////
