<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:aw="http://animeweb.com/xml" version="2.0"
                xmlns:xlink="http://www.w3.org/1999/xlink">
    <xsl:template match="/aw:animeWeb">
        <svg width="1200px" height="4100px" xmlns="http://www.w3.org/2000/svg" style="background-color: #f5f5f5;">

            <xsl:variable name="titleSize" select="28" />
            <xsl:variable name="imgWidth" select="230" />
            <xsl:variable name="imgHeight" select="332" />
            <xsl:variable name="imgBottomMargin" select="50" />
            <xsl:variable name="imgLeftMargin" select="200" />
            <xsl:variable name="imgRightMargin" select="25" />
            <xsl:variable name="animeListStart" select="200" />

            <defs>
                <g id="star" fill="gold">
                    <polygon points="8,0.8 3.2,16 15.4,6.3 0.8,6.3 12.9,16"/>
                </g>
            </defs>

            <text x="{$imgLeftMargin}" y="100" style="font-size: 40px;">
                <tspan fill="#3FC1C9">A</tspan>nime<tspan fill="#FC5185">W</tspan>eb
            </text>

            <xsl:for-each select="animeList/anime">
                <xsl:variable name="pos" select="$animeListStart + (position() - 1) * ($imgHeight + $imgBottomMargin)" />
                <xsl:variable name="url" select="img/@src" />

                <rect x="{$imgLeftMargin}" y="{$pos}" width="{$imgWidth}" height="{$imgHeight}" fill="black" />
                <image x="{$imgLeftMargin}" y="{$pos}" width="{$imgWidth}" height="{$imgHeight}" href="{$url}" />
                <text x="{$imgLeftMargin + $imgWidth + $imgRightMargin}" y="{$pos + $titleSize}" style="font-size: {$titleSize}px;">
                    <xsl:value-of select="title" />
                </text>

                <xsl:variable name="rating" select="rating" />
                <xsl:variable name="starSize" select="16" />
                <xsl:variable name="starYPos" select="$pos + $titleSize + $starSize" />
                <xsl:variable name="starsXBegin" select="$imgLeftMargin + $imgWidth + $imgRightMargin + 55" />

                <text x="{$imgLeftMargin + $imgWidth + $imgRightMargin}" y="{$pos + $titleSize + 30}" style="font-size: 16px;">
                    Rating:
                </text>

                <xsl:variable name="count" select="10"/>
                <xsl:for-each select="(//*)[position()&lt;=$count]">
                    <use xlink:href="#star" x="{$starsXBegin + ((position() - 1) * $starSize)}" y="{$starYPos}" />
                </xsl:for-each>

                <line x1="{$starsXBegin + (10 * $starSize)}"
                      y1="{$starYPos + ($starSize div 2)}"
                      x2="{$starsXBegin}"
                      y2="{$starYPos + ($starSize div 2)}" stroke-width="{$starSize}" stroke="#f5f5f5">
                    <animate attributeName="x2" attributeType="XML" begin="1.2s" dur="4s" fill="freeze"
                             from="{$starsXBegin}" to="{$starsXBegin + (16 * $rating)}"/>
                </line>

                <text x="{$imgLeftMargin + $imgWidth + $imgRightMargin}" y="{$pos + $titleSize + 50}" style="font-size: 16px;">
                    Release date: <xsl:value-of select="releaseDate" />
                </text>

                <text x="{$imgLeftMargin + $imgWidth + $imgRightMargin}" y="{$pos + $titleSize + 70}" style="font-size: 16px;">
                    Type: <xsl:choose>
                        <xsl:when test="numberOfEpisodes">
                            <xsl:text>Series</xsl:text>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:text>Movie</xsl:text>
                        </xsl:otherwise>
                    </xsl:choose>
                </text>

                <text x="{$imgLeftMargin + $imgWidth + $imgRightMargin}" y="{$pos + $titleSize + 90}" style="font-size: 16px;">
                    Genres: <xsl:for-each select="genreList/genre">
                    <xsl:value-of select="@genreId" />
                    <xsl:choose>
                        <xsl:when test="position() != last()">
                            <xsl:text>, </xsl:text>
                        </xsl:when>
                    </xsl:choose>
                </xsl:for-each>
                </text>
            </xsl:for-each>
        </svg>
    </xsl:template>
</xsl:stylesheet>